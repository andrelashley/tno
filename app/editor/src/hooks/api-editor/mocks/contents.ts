import { ContentStatus, IContentModel } from '..';
import { mockMediaTypes } from './mediaTypes';
import { mockUsers } from './users';

export const mockContents: IContentModel[] = [
  {
    id: 1,
    headline: 'test',
    source: 'source',
    mediaTypeId: mockMediaTypes[0].id,
    mediaType: mockMediaTypes[0],
    ownerId: mockUsers[0].id,
    owner: mockUsers[0],
    page: 'page',
    status: ContentStatus.InProgress,
    section: 'section',
    date: new Date(),
    use: true,
  },
];
