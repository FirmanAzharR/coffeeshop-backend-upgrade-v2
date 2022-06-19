const logger = require('./logger')

const logs = (message, url, body, status, data) => {
    logger.info(
        `message ::${message} - url:: ${url} - body:: ${JSON.stringify(
            body
        )} - status:: ${status} - response:: ${JSON.stringify(data)}`
    )
}

module.exports = {
    logs,
}
