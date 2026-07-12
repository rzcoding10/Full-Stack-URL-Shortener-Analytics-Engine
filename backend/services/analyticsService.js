const UAParser = require('ua-parser-js');
const mongoose = require('mongoose');
const Click = require('../models/Click');
const Link = require('../models/Link');

exports.trackClick = async (linkId, ipAddress, userAgentString, referrer) => {
    const parser = new UAParser();
    const result = parser.setUA(userAgentString).getResult();

    const browser = result.browser.name || 'Unknown';
    const os = result.os.name || 'Unknown';
    const device = result.device.type || 'desktop'; 
    const finalReferrer = referrer || 'Direct';

    await Promise.all([
        Click.create({
            linkId,
            ipAddress,
            browser,
            os,
            device,
            referrer: finalReferrer
        }),
        Link.findByIdAndUpdate(linkId, {
            $inc: { totalClicks: 1 },
            lastVisited: Date.now()
        })
    ]);
};

exports.getLinkMetrics = async (linkId) => {
    const metrics = await Click.aggregate([
        { $match: { linkId: new mongoose.Types.ObjectId(linkId) } },
        {
            $facet: {
                browsers: [
                    { $group: { _id: "$browser", clicks: { $sum: 1 } } },
                    { $sort: { clicks: -1 } }
                ],
                operatingSystems: [
                    { $group: { _id: "$os", clicks: { $sum: 1 } } },
                    { $sort: { clicks: -1 } }
                ],
                devices: [
                    { $group: { _id: "$device", clicks: { $sum: 1 } } },
                    { $sort: { clicks: -1 } }
                ],
                dailyClicks: [
                    {
                        $group: {
                            _id: {
                                $dateToString: { format: "%Y-%m-%d", date: "$clickedAt" }
                            },
                            clicks: { $sum: 1 }
                        }
                    },
                    { $sort: { "_id": 1 } }
                ]
            }
        }
    ]);

    return metrics[0];
};