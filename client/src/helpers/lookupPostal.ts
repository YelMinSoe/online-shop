export const lookupPostal = async (code: string) => {
  const digits = code.normalize("NFKC").replace(/\D/g, "")
  if (digits.length !== 7) return null
  try {
    const res = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${digits}`
    )
    const data = await res.json()
    const r = data.results?.[0]
    if (!r) return null
    return `${r.address1}${r.address2}${r.address3}` // for example =>  東京都千代田区千代田
  } catch {
    return null // if api is failed return null
  }
}
