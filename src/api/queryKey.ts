export const shelterKey = {
  all: ['shelter'] as const,
  animalList: () => [...shelterKey.all, 'observation-animal-list'] as const,
  animal: (id: number) => [...shelterKey.animalList(), id] as const,
  image: () => [...shelterKey.all, 'image'] as const,
  info: () => [...shelterKey.all, 'info'] as const
};
