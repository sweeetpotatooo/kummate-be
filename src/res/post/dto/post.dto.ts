export class PostDTO {
  id: number;
  title: string;
  content: string;
  author: string;
  createdDate: Date;
  updatedDate: Date;

  constructor(
    id: number,
    title: string,
    content: string,
    author: string,
    createdDate: Date,
    updatedDate: Date,
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.author = author;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
  }
}
