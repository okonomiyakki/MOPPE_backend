interface BookmarkProfile {
  bookmark_id: number;
  project_id: number;
  user_id: number;
}

export type UserBookmarkedProjects = Pick<BookmarkProfile, 'project_id'>;
