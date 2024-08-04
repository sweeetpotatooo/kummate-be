export class UserDTO {
  id: number;
  name: string;
  email: string;
  createdDate: Date;
  updatedDate: Date;

  constructor(
    id: number,
    name: string,
    email: string,
    createdDate: Date,
    updatedDate: Date,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
  }
}
