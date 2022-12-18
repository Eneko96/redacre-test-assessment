import bitcoin from '../../assets/bitcoin.svg'
import ripple from '../../assets/ripple.svg'
import ethereum from '../../assets/ethereum.svg'
import usd from '../../assets/usd.svg'
import gbp from '../../assets/gbp.svg'
import eur from '../../assets/eur.svg'
import dogecoin from '../../assets/dogecoin.svg'
import cardano from '../../assets/cardano.svg'

// Library for importing the existing images
export const icons = (item: string) =>
  ({
    bitcoin,
    ripple,
    ethereum,
    dogecoin,
    cardano,
    usd,
    eur,
    gbp,
  }[item])

// Abstract the logic for the form retrieval
export const retrieveForm = (form: HTMLFormElement) => {
  const formData = new FormData(form)
  const dataForm = Object.fromEntries(formData) as any
  return dataForm
}
