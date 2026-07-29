type Handler = (cmd: string) => void;
let handler: Handler | null = null;

export const bus = {
  emit(cmd: string) {
    handler?.(cmd);
  },
  on(h: Handler): () => void {
    handler = h;
    return () => {
      handler = null;
    };
  },
};
