export const Players = {
    JASON: 'jason',
    CLAY: 'clay',
    RICHIE: 'richie',
    LAWRENECE: 'lawrence',
  } as const
  
  export type PlayerId = (typeof Players)[keyof typeof Players]
  