const logger = require('./logger')

const logs = (url, body, status, data) => {
    logger.info(
        `url:: ${url} - body:: ${JSON.stringify(
            body
        )} - status:: ${status} - response:: ${JSON.stringify(data)}`
    )
}

module.exports = {
    logs,
}
