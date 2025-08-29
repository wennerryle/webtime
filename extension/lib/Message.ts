import * as v from "valibot";

export const MessageSchema = v.object({
  timeSpended: v.number(),
});

export type Message = v.InferInput<typeof MessageSchema>;
