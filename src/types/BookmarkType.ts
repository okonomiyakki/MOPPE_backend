interface BookmarkProfile {
  bookmark_id: number;
  project_id: number;
  user_id: number;
}

export type BookmarkedProjects = Pick<BookmarkProfile, 'project_id'>;

export type BookmarkedProjectIds = number;
