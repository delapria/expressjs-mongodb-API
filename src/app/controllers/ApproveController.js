const Purchase = require('../models/Purchase')

class ApproveController {
  async index (req, res) {
    const purchase = await Purchase.find().populate({
      path: 'ad',
      populate: {
        path: 'author'
      }
    })
    // .populate({
    //   path: 'client'
    // })

    return res.json(purchase)
  }

  async update (req, res) {
    const { id } = req.params

    const { ad } = await Purchase.findById(id).populate({
      path: 'ad',
      populate: {
        path: 'author'
      }
    })

    if (!ad.author._id.equals(req.userId)) {
      return res.status(401).json({ error: "You're not the ad author" })
    }

    if (ad.purchasedBy) {
      return res.status(400).json({ error: 'The ad was already sold' })
    }

    ad.purchasedBy = id

    await ad.save()

    return res.json(ad)
  }

  async destroy (req, res) {
    const { ad } = await Purchase.findById(req.params.id).populate({
      path: 'ad'
    })

    if (ad.purchasedBy) {
      ad.purchasedBy = null
      await ad.save()
    }

    await Purchase.findByIdAndDelete(req.params.id)

    return res.send()
  }
}

module.exports = new ApproveController()
