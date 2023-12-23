import {Category} from "./category.model";

export class Item {
  id: string
  name: string
  shortName: string
  weight: number
  wikiLink: string
  iconLink: string
  inspectImageLink: string
  category: Category

  constructor(id: string, name: string, shortName: string, weight: number, wikiLink: string, iconLink: string, inspectImageLink: string, category: Category) {
    this.id = id
    this.name = name
    this.shortName = shortName
    this.weight = weight
    this.wikiLink = wikiLink
    this.iconLink = iconLink
    this.inspectImageLink = inspectImageLink
    this.category = category
  }
}
