import { useMutation } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useSubmitBrief() {
  return useMutation(orpc.briefs.create.mutationOptions());
}
