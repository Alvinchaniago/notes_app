export interface Note {
  /* ID FROM MONGODB STARTS WITH _ */
  _id: string;
  title: string;
  text?: string;
  createdAt: string;
  updatedAt: string;
}
