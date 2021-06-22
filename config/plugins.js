module.exports = ({env}) => ({
  // ...
  upload: {
    provider: 'aws-s3',
    providerOptions: {
      accessKeyId: 'AKIAS3DTMQHJSVM4M5WU',
      secretAccessKey: '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',
      region: 'ca-central-1',
      params: {
        Bucket: 'lsdc',
      },
    },
  },
});
