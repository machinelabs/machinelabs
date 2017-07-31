export const ML_YAML = `

# Set the dockerImageId to choose between different environments
#
# Currently supported:
#
# dockerImageId                  |      description
# keras_v2-0-x_python_3-1        | Keras 2.0.4 and Python 3.1
# keras_v2-0-x_python_2-1        | Keras 2.0.4 and Python 2.1

dockerImageId: keras_v2-0-x_python_3-1
`;

export const ML_YAML_FILE = {
  name: 'ml.yaml',
  content: ML_YAML
};
