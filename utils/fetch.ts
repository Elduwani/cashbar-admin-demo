import { useToast } from "@contexts/Notification.context"
import axios from "axios"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const BASE_API_URL = 'api'
export const placeholderData = { data: [] }
export const queryLimit = 25

export function useFetchClient() {
   // const { data: session } = useSession()
   let instance = axios.create({ baseURL: BASE_API_URL as string })

   // if (session?.access_token) {
   //     instance.defaults.headers.common['Authorization'] = `Bearer ${session.access_token}`;
   // }

   instance.interceptors.response.use((response) => {
      return response
   }, (error) => {
      // console.log(error?.response.status)
      if (error.response?.status === 401) {
         // Expired or invalid token
         // signOut()
      }

      return Promise.reject(error)
   })

   return instance;
}

interface _FetchProps<T> {
   url: string,
   key: string | any[],
   enabled?: boolean,
   keepPreviousData?: boolean,
   errorMessage?: string,
   placeholderData?: T,
}
export function useFetch<T>({ url, key, enabled = true, keepPreviousData = false, placeholderData }: _FetchProps<T>) {
   // const { data: session } = useSession()
   const handleFetch = useHandleFetch()
   const handleErrors = useHandleErrors()

   const queryResponse = useQuery({
      queryKey: [key ?? url],
      enabled: enabled && !url.match(/undefined/i),
      queryFn: handleFetch(url),
      placeholderData,
      keepPreviousData,
      onError: (error: _Object) => handleErrors(error, `Error fetching ${key ?? url}`),
      onSettled: () => {

      }
   })

   return queryResponse
}

export interface UseMutateProps {
   url: string,
   refetchKeys?: any[],
   onSuccessCallback?: Function,
   successMessage?: string,
   errorMessage?: string,
   method?: "get" | "post" | "put" | "delete",
}
export function useMutate({ url, refetchKeys, onSuccessCallback, successMessage, errorMessage, method }: UseMutateProps) {
   const fetchClient = useFetchClient()
   const queryClient = useQueryClient()
   const handleErrors = useHandleErrors()
   const { notify } = useToast()

   const { data, isLoading, isSuccess, isError, error, mutate, reset } = useMutation(data =>
      fetchClient[method ?? 'post'](url, data as any),
      {
         onSuccess: (data) => {
            if (refetchKeys) {
               refetchKeys.forEach(k => {
                  queryClient.refetchQueries(k, {
                     predicate: ({ queryKey }) => {
                        if (Array.isArray(queryKey)) {
                           return !queryKey.some(key => key === undefined)
                        }
                        return true
                     }
                  })
               })
            }
            notify({ message: successMessage ?? "Request processed successfully" })
            onSuccessCallback?.(data.data)
         },
         onError: (error: _Object) => {
            handleErrors(error, errorMessage ?? "Error processing request")
         }
      }
   )

   return { data, isLoading, isSuccess, isError, error, mutate, reset }
}

export function useInfiniteFetch<T>({ url, key, enabled = true }: Pick<_FetchProps<T>, "url" | "key" | "enabled" | "placeholderData">) {
   const resTemplate = { pages: [], pageParams: [] }
   const handleFetch = useHandleFetch()(url)

   const {
      error,
      data = resTemplate,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      status
   } = useInfiniteQuery({
      queryKey: [key],
      queryFn: handleFetch,
      enabled: enabled && !url.match(/undefined/i),
      getNextPageParam: (lastPage: any) => {
         if (!lastPage?.meta) return false
         return lastPage.meta.page < lastPage.meta.pageCount
      },
   })

   return { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status }
}

function useHandleFetch() {
   const fetchClient = useFetchClient()
   return (url: string) => {
      const address = BASE_API_URL + (url)
      // console.log("fetching " + address)
      if (url.match('undefined')) {
      }
      return async () => {
         if (url) {
            const response = await fetchClient.get(address)
            return response.data
         }
      }
   }
}

function useHandleErrors() {
   const { notify } = useToast()

   return (error: _Object, message: string) => {
      if (error?.response?.status !== 401) {
         notify({ variant: 'error', message })
      }
      if (error?.response?.status === 403) {
         message = `Request not permitted for your account.`
         notify({ variant: 'error', message })
      }
   }
}