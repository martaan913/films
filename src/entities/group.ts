export class Group {
  constructor(
    public name: string,
    public permissions: string[] = [],
    public id?: number
  ){}
}