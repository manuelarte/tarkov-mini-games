export class Item {
  id: string
  name: string
  shortName: string
  weight: number
  wikiLink: string
  iconLink: string
  inspectImageLink: string

  constructor(id: string, name: string, shortName: string, weight: number, wikiLink: string, iconLink: string, inspectImageLink: string) {
    this.id = id
    this.name = name
    this.shortName = shortName
    this.weight = weight
    this.wikiLink = wikiLink
    this.iconLink = iconLink
    this.inspectImageLink = inspectImageLink
  }
}
