import { useQuery } from 'react-apollo'
import { Query, QueryProductsByIdentifierArgs } from 'vtex.search-graphql'

import GET_PRODUCTS from '../graphql/productQuery.graphql'
import { useOrderFormCustom } from './useOrderFormCustom'

type GetProductsQuery = Pick<Query, 'productsByIdentifier'>

export function useProducts() {
  const { orderForm } = useOrderFormCustom()

  return useQuery<GetProductsQuery, QueryProductsByIdentifierArgs>(
    GET_PRODUCTS,
    {
      skip: !orderForm.items.length,
      variables: {
        field: 'id',
        values: orderForm.items.map((item) => item.productId) as string[],
      },
    }
  )
}
