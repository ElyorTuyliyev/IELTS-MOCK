type GraphQLErrorLike = { message?: string }

type GraphQLErrorSource = {
  graphQLErrors?: GraphQLErrorLike[]
  message?: string
}

export function tryGetGraphQLErrorMessage(error: unknown): string | null {
  if (!error || typeof error !== 'object') return null
  const source = error as GraphQLErrorSource
  const gqlErrors =
    'graphQLErrors' in source && Array.isArray(source.graphQLErrors)
      ? source.graphQLErrors
      : (source.graphQLErrors ?? [])
  const gqlMsg = gqlErrors[0]?.message
  if (gqlMsg && String(gqlMsg).trim()) return String(gqlMsg)
  if (source.message && String(source.message).trim()) return source.message
  return null
}

export function getGraphQLErrorMessage(error: unknown, fallback: string): string {
  return tryGetGraphQLErrorMessage(error) ?? fallback
}

export type ApolloMutationResultLike = {
  error?: { message?: string } | null
  errors?: ReadonlyArray<{ message?: string }> | null
}

export function getMutationErrorMessage(result: ApolloMutationResultLike): string | null {
  if (result.error?.message) return result.error.message
  const first = result.errors?.[0]?.message
  return first && String(first).trim() ? String(first) : null
}
