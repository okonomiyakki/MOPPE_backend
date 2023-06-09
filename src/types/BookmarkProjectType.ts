interface BookmarkProjectProfile {
  bookmark_id: number;
  project_id: number;
  user_id: number;
}

export type CreateInput = Pick<BookmarkProjectProfile, 'project_id' | 'user_id'>;

export type BookmarkedProjects = Pick<BookmarkProjectProfile, 'project_id'>;

export type BookmarkedProjectIds = number;

export type Id = number;
