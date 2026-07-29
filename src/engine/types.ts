import type { ReactNode } from "react";

export type GameKind = "snake" | "bat";

export type CommandCtx = {
    print: (node:ReactNode) => void;
    clear: () => void;
    launchGame: (kind: GameKind) => void;
};

export type Command = {
    desc: string;
    run: (ctx: CommandCtx) => void;
}