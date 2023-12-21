export class Item {
  id: string
  name: string
  shortName: string
  wikiLink: string
  iconLink: string

  constructor(id: string, name: string, shortName: string, wikiLink: string, iconLink: string) {
    this.id = id
    this.name = name
    this.shortName = shortName
    this.wikiLink = wikiLink
    this.iconLink = iconLink
  }
}
