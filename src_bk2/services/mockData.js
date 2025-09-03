export const MOCK_MODELS = [
  {
    model_name: 'bert-base-uncased',
    source: 'huggingface',
    publisher: 'google-bert',
    branch: 'main',
    uploader: 'admin',
    create_time: '2025-08-21T06:47:06.23900'
  },
  {
    model_name: 'gpt2',
    source: 'huggingface',
    publisher: 'openai',
    branch: 'main',
    uploader: 'ops',
    create_time: '2025-07-10T03:21:10.00000'
  },
  {
    model_name: 'resnet50',
    source: 'internal-registry',
    publisher: 'vision-team',
    branch: 'release',
    uploader: 'buildbot',
    create_time: '2025-06-05T11:11:11.00000'
  },
  {
    model_name: 't5-small',
    source: 'huggingface',
    publisher: 'google-t5',
    branch: 'dev',
    uploader: 'tester',
    create_time: '2025-05-15T10:00:00.00000'
  },
  {
    model_name: 'whisper-base',
    source: 'huggingface',
    publisher: 'openai',
    branch: 'audio',
    uploader: 'alice',
    create_time: '2025-04-12T08:33:00.00000'
  },
  {
    model_name: 'clip-vit',
    source: 'internal-registry',
    publisher: 'ml-vision',
    branch: 'exp',
    uploader: 'bob',
    create_time: '2025-03-01T14:20:00.00000'
  },
  {
    model_name: 'llama2-7b',
    source: 'meta-research',
    publisher: 'meta-ai',
    branch: 'main',
    uploader: 'charlie',
    create_time: '2025-02-21T12:00:00.00000'
  },
  {
    model_name: 'albert-base-v2',
    source: 'huggingface',
    publisher: 'google-albert',
    branch: 'stable',
    uploader: 'david',
    create_time: '2025-01-05T09:00:00.00000'
  },
  {
    model_name: 'mobilenet-v3',
    source: 'internal-registry',
    publisher: 'vision-team',
    branch: 'prod',
    uploader: 'eva',
    create_time: '2024-12-25T11:59:00.00000'
  },
  {
    model_name: 'wav2vec2-base',
    source: 'huggingface',
    publisher: 'facebook-ai',
    branch: 'audio',
    uploader: 'frank',
    create_time: '2024-12-01T07:45:00.00000'
  }
];

export const MOCK_DETAILS = {
  message: 'Success',
  Content: {
    folder: [
      '/',
      '/coreml/fill-mask/float32_model.mlpackage/',
      '/coreml/fill-mask/float32_model.mlpackage/Data/com.apple.CoreML/',
      '/coreml/fill-mask/float32_model.mlpackage/Data/com.apple.CoreML/weights',
      '/pytorch/',
      '/onnx/',
      '/onnx/ops/',
      '/onnx/weights/'
    ],
    file_list: [
      { Name: 'flax_model.msgpack', Size: 438064459, Createtime: '2025-08-21T06:52:13', Path: '/' },
      { Name: 'pytorch_model.bin', Size: 421231231, Createtime: '2025-08-21T06:52:50', Path: '/pytorch/' },
      { Name: 'config.json', Size: 51234, Createtime: '2025-08-21T06:52:51', Path: '/' },
      { Name: 'merges.txt', Size: 23456, Createtime: '2025-08-21T06:53:00', Path: '/' },
      { Name: 'vocab.json', Size: 34567, Createtime: '2025-08-21T06:53:05', Path: '/' },
      { Name: 'special_tokens_map.json', Size: 1200, Createtime: '2025-08-21T06:53:07', Path: '/' },
      { Name: 'model.onnx', Size: 104857600, Createtime: '2025-08-21T06:54:00', Path: '/onnx/' },
      { Name: 'opset11.pbtxt', Size: 4523, Createtime: '2025-08-21T06:54:10', Path: '/onnx/ops/' },
      { Name: 'onnx_weights.bin', Size: 250000000, Createtime: '2025-08-21T06:54:20', Path: '/onnx/weights/' },
      { Name: 'model.mlmodel', Size: 164911, Createtime: '2025-08-21T06:53:19', Path: '/coreml/fill-mask/float32_model.mlpackage/Data/com.apple.CoreML' }
    ],
    total: 10
  }
};
