package ca.bc.gov.tno.dal.db;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Component;

import ca.bc.gov.tno.dal.db.entities.Content;
import ca.bc.gov.tno.dal.db.entities.ContentAction;
import ca.bc.gov.tno.dal.db.entities.ContentCategory;
import ca.bc.gov.tno.dal.db.entities.ContentTag;
import ca.bc.gov.tno.dal.db.entities.ContentTone;
import ca.bc.gov.tno.dal.db.models.FilterCollection;
import ca.bc.gov.tno.dal.db.models.LogicalOperators;
import ca.bc.gov.tno.dal.db.models.SortParam;
import ca.bc.gov.tno.dal.db.services.interfaces.IContentService;
import ca.bc.gov.tno.dal.db.services.interfaces.IContentTypeService;
import ca.bc.gov.tno.dal.db.services.interfaces.IDataSourceService;
import ca.bc.gov.tno.dal.db.services.interfaces.ILicenseService;
import ca.bc.gov.tno.dal.db.services.interfaces.IMediaTypeService;
import ca.bc.gov.tno.dal.db.services.interfaces.IUserService;

@Component
public class ContentTest {
  IContentService contentService;
  IContentTypeService contentTypeService;
  IMediaTypeService mediaTypeService;
  ILicenseService licenseService;
  IDataSourceService dataSourceService;
  IUserService userService;

  @Autowired
  public ContentTest(final IContentService contentService, final IContentTypeService contentTypeService,
      final IMediaTypeService mediaTypeService, final ILicenseService licenseService,
      final IDataSourceService dataSourceService, final IUserService userService) {
    this.contentService = contentService;
    this.contentTypeService = contentTypeService;
    this.mediaTypeService = mediaTypeService;
    this.licenseService = licenseService;
    this.dataSourceService = dataSourceService;
    this.userService = userService;
  }

  public void Run() {
    var result = Add();
    result = Update(result);
    FindById(result);
    FindById(result, true);
    Delete(result);
    Paging();
  }

  public Content Add() {
    var contentType = contentTypeService.findById(1).get(); // Snippet
    var mediaType = mediaTypeService.findById(3).get(); // TV
    var license = licenseService.findById(1).get(); // 90
    // var dataSource = dataSourceService.findById(1).get();
    var user = userService.findById(1).get(); // Admin

    var content = new Content(contentType, mediaType, license, null, "SOURCE", user, ContentStatus.Published,
        "headline");
    content.getContentActions().add(new ContentAction(content, 1, "test"));
    content.getContentTags().add(new ContentTag(content, "TBD"));
    content.getContentTonePools().add(new ContentTone(content, 1, 3));
    content.getContentCategories().add(new ContentCategory(content, 1, 67));

    var added = contentService.add(content);
    if (added.getCreatedOn() == null || added.getUpdatedOn() == null)
      throw new IllegalStateException("Audit dates were not set");
    if (added.getCreatedOn().compareTo(added.getUpdatedOn()) != 0)
      throw new IllegalStateException("Audit dates must be the same");

    return added;
  }

  public Content Update(Content entity) {
    entity.setUid("uid");
    entity.setCreatedBy("illegal");
    entity.setCreatedById(UUID.randomUUID());
    entity.setStatus(ContentStatus.Unpublish);

    var updated = contentService.update(entity);
    if (entity.getCreatedOn().compareTo(updated.getCreatedOn()) != 0)
      throw new IllegalStateException("Audit createdOn must not change");
    if (entity.getCreatedById() != updated.getCreatedById())
      throw new IllegalStateException("Audit createdById must not change");
    if (entity.getCreatedBy() != updated.getCreatedBy())
      throw new IllegalStateException("Audit createdBy must not change");
    if (entity.getUpdatedOn().compareTo(updated.getUpdatedOn()) >= 0)
      throw new IllegalStateException("Audit updatedOn must be after prior timestamp");
    if (entity.getUid() != updated.getUid())
      throw new IllegalStateException("Property 'uid' was not set");

    var updatedOn = updated.getUpdatedOn();
    try {
      // Test for optimistic concurrency.
      updated.setUpdatedOn(new Date());
      contentService.update(updated);
      updated.setUpdatedOn(updatedOn);
      throw new IllegalStateException("Concurrency Failed");
    } catch (ObjectOptimisticLockingFailureException e) {
      // Successful
    } catch (Exception e) {
      throw new IllegalStateException("Concurrency Failed");
    } finally {
      updated.setUpdatedOn(updatedOn);
    }

    return updated;
  }

  public Optional<Content> FindById(Content entity) {

    var result = contentService.findById(entity.getId());
    if (result.isEmpty())
      throw new IllegalStateException();

    return result;
  }

  public Optional<Content> FindById(Content entity, Boolean eager) {

    var result = contentService.findById(entity.getId(), eager);
    if (result.isEmpty())
      throw new IllegalStateException("Entity was not found");
    if (result.get().getContentActions().size() == 0)
      throw new IllegalStateException("Content.contentTags should have results");

    return result;
  }

  public void Delete(Content entity) {
    contentService.delete(entity);

    var result = contentService
        .findById(entity.getId())
        .orElse(null);
    if (result != null)
      throw new IllegalStateException("Entity must be deleted");
  }

  public void Paging() {
    var contentType = contentTypeService.findById(1).get(); // Snippet
    var mediaType = mediaTypeService.findById(3).get(); // TV
    var license = licenseService.findById(1).get(); // 90
    // var dataSource = dataSourceService.findById(1).get();
    var user = userService.findById(1).get(); // Admin

    var c1 = contentService
        .add(new Content(contentType, mediaType, license, null, "S1", user, ContentStatus.Published, "headline 1"));
    var c2 = contentService
        .add(new Content(contentType, mediaType, license, null, "S1", user, ContentStatus.Publish, "headline 2"));
    var c3 = contentService
        .add(new Content(contentType, mediaType, license, null, "S2", user, ContentStatus.Publish,
            "another title 3"));

    var result = contentService.find(1, 2, null, null);

    if (result.getItems().size() != 2)
      throw new IllegalStateException("Result should return 2 items");
    if (result.getPage() != 1)
      throw new IllegalStateException("Property 'page' should be 1");
    if (result.getQuantity() != 2)
      throw new IllegalStateException("Property 'quantity' should be 2");
    if (result.getTotal() == 0)
      throw new IllegalStateException("Property 'total' should not be 0");
    if (result.getItems().get(0).getContentType() == null)
      throw new IllegalStateException("Property 'contentType' should not be null");
    if (result.getItems().get(0).getLicense() == null)
      throw new IllegalStateException("Property 'license' should not be null");
    if (result.getItems().get(0).getMediaType() == null)
      throw new IllegalStateException("Property 'mediaType' should not be null");
    if (result.getItems().get(0).getOwner() == null)
      throw new IllegalStateException("Property 'owner' should not be null");

    var filter = new FilterCollection();
    filter.addFilter("headline", LogicalOperators.Contains, "head");
    filter.addFilter("source", LogicalOperators.Contains, "S");
    filter.addFilter("mediaTypeId", LogicalOperators.Equals, 3);
    filter.addFilter("createdOn", LogicalOperators.LessThanOrEqual, new Date());
    var sort = new SortParam[] { new SortParam("id", SortDirection.Descending) };
    result = contentService.find(1, 10, filter, sort);

    if (result.getItems().size() != 2)
      throw new IllegalStateException("Result should return 2 items");
    if (result.getTotal() != 2)
      throw new IllegalStateException("Property 'total' should be 2");
    if (result.getItems().get(0).getId() < result.getItems().get(1).getId())
      throw new IllegalStateException("Sort should be descending on 'id'");

    filter.addFilter("userId", LogicalOperators.Equals, 1);
    result = contentService.find(1, 10, filter, sort);
    if (result.getItems().get(0).getOwnerId() != 1)
      throw new IllegalStateException("Results should belong to owner 1");

    contentService.delete(c1);
    contentService.delete(c2);
    contentService.delete(c3);
  }
}
