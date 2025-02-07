import { getAssetsFromDtList } from '@utils/aquarius'
import { calculateUserLiquidity } from '@utils/pool'
import { CancelToken } from 'axios'
import { PoolShares_poolShares as PoolShare } from '../../../../@types/subgraph/PoolShares'
import { AssetPoolShare } from '.'
import { Asset } from '@oceanprotocol/lib'

function getAsset(items: Asset[], datatoken: string): Asset {
  for (let i = 0; i < items.length; i++) {
    if (
      items[i].datatokens[0].address.toLowerCase() === datatoken.toLowerCase()
    )
      return items[i]
  }
  return null
}

export async function getAssetsFromPoolShares(
  data: PoolShare[],
  chainIds: number[],
  cancelToken: CancelToken
) {
  if (data.length < 1) return []

  const assetList: AssetPoolShare[] = []
  const dtList: string[] = []

  for (let i = 0; i < data.length; i++) {
    dtList.push(data[i].pool.datatoken.address)
  }
  const ddoList = await getAssetsFromDtList(dtList, chainIds, cancelToken)

  for (let i = 0; i < data.length; i++) {
    const userLiquidity = calculateUserLiquidity(
      data[i].shares,
      data[i].pool.totalShares,
      data[i].pool.baseTokenLiquidity
    )
    console.log(data[i].pool.datatoken.address, userLiquidity)
    assetList.push({
      poolShare: data[i],
      userLiquidity,
      networkId: getAsset(ddoList, data[i].pool.datatoken.address).chainId,
      createTime: data[i].pool.createdTimestamp,
      asset: getAsset(ddoList, data[i].pool.datatoken.address)
    })
  }
  return assetList
}
