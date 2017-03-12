const BinaryServer = require('binaryjs').BinaryServer;
const bs = BinaryServer({port: 9001});
const wav = require('wav');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const baseRecordsPath = path.join(__dirname, 'recordings');
const lockedFileName = '.locked';

import {START, UPLOAD, RESUME, STOP} from 'shared/Recorder/Constants/actions';

const generateRecordPath = (recordId) => path.join(baseRecordsPath, recordId);

const startRecording = (recordId) => {
    const recordingPath = generateRecordPath(recordId);

    fse.ensureDirSync(recordingPath);
};

const isRecordingLocked = (recordId) => {
    const recordingPath = generateRecordPath(recordId);

};

const completeRecording = (recordId) => {
    const recordingPath = generateRecordPath(recordId);

};

const lockRecording = (recordId) => {
    const recordingPath = generateRecordPath(recordId);
    const lockFile = path.join(recordingPath, lockedFileName);

    fse.outputFileSync(lockFile, 'hello!')
};

const unlockRecording = (recordId) => {
    const recordingPath = generateRecordPath(recordId);
    const lockFile = path.join(recordingPath, lockedFileName);

    fse.removeSync(lockFile);
};

const walkSync = (currentDirPath, callback) => {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        const filePath = path.join(currentDirPath, name);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
};

function fileList(dir) {
    return fs.readdirSync(dir).reduce((list, file) => {
        const name = path.join(dir, file);
        const isDir = fs.statSync(name).isDirectory();
        return list.concat(isDir ? fileList(name) : [name]);
    }, []);
}

const getRecordingChunks = (recordId) => {
    const recordingPath = generateRecordPath(recordId);

    return fileList(recordingPath);
};

console.log(`Wait for new user connections`);
bs.on('connection', (client) => {
    console.dir('connection');

    client.on('stream', (stream, meta) => {
        console.log('stream');
        console.log('meta', meta);

        switch (meta.event) {
            case START:
                console.dir('starting...');

            case UPLOAD:
                console.dir('uploading...');
                break;

            case RESUME:
                console.dir('resuming...');
                break;

            case STOP:
                console.dir('stopping...');
                break;
        }
    });

    // console.log(`Incoming stream from browsers`);
    // //
    // var fileWriter = new wav.FileWriter(outFile, {
    //     channels: 1,
    //     sampleRate: 48000,
    //     bitDepth: 16
    // });
    //
    // client.on('stream', function(stream, meta) {
    //     console.log('new stream');
    //     stream.pipe(fileWriter);
    //
    //     stream.on('end', function() {
    //         fileWriter.end();
    //         console.log('wrote to file ' + outFile);
    //     });
    // });
});

const testId = 'test';
// startRecording(testId);
// unlockRecording(testId);
const r = getRecordingChunks(testId);
console.log(r);