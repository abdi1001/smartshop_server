const fs = require('fs')
const path = require('path')

const getFileNameFromUrl = (photoUrl) => {
    try {

        const url = new URL(photoUrl)
        const fileName = path.basename(url.pathname)
        return fileName
        
    } catch (error) {
        console.log('Invalid URL: ', error)
        return null
    }
}

const deleteFile = (fileName) => {

    return new Promise((resolve, reject) => {

        if (!fileName) {
            return resolve()
        }

        const fullImagePath = path.join(__dirname, '../uploads', fileName)

        fs.access(fullImagePath, fs.constants.F_OK, (accessErr) =>{

            if(accessErr) {
                console.error('File does not exist', fullImagePath)
                return resolve();
            }
        })

        fs.unlink(fullImagePath, (unlinkErr) => {
            if(unlinkErr) {
                console.error('Error delting image', unlinkErr)
            } else {
                console.log('Image deletes successfully');
                return resolve()
            }
        })
    })
}

module.exports = {
    getFileNameFromUrl,
    deleteFile
}