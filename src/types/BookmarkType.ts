interface BookmarkProfile {
  bookmark_id: number;
  project_id: number;
  user_id: number;
}

export type CreateInput = Pick<BookmarkProfile, 'project_id' | 'user_id'>;

export type BookmarkedProjects = Pick<BookmarkProfile, 'project_id'>;

export type BookmarkedProjectIds = number;

export type Id = number;
