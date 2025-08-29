import * as v from "valibot";

export const TimeSpendedSchema = v.object({
  _tag: v.literal("time_spended_schema"),
  timeSpended: v.number(),
});

export type TimeSpended = v.InferInput<typeof TimeSpendedSchema>;

export const CredentialsChangedSchema = v.object({
  _tag: v.literal("credentials_changed_schema"),
  url: v.string(),
  username: v.string(),
  password: v.string(),
});

export type CredentialsChanged = v.InferInput<typeof CredentialsChangedSchema>;
