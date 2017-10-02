export const ML_YAML = `

# Set the dockerImageId to choose between different environments
#
# Currently supported:
#
# dockerImageId                  |      description
# keras_v2-0-x_python_3-1        | Keras 2.0.4 and Python 3.1
# keras_v2-0-x_python_2-1        | Keras 2.0.4 and Python 2.1

dockerImageId: keras_v2-0-x_python_3-1

# You can define command line arguments that will be passed to the
# execution of main.py (optional)
#
# Example:
#
# parameters:
#   - pass-as: --learning_rate=5
#   - pass-as: --max_steps=200
#
# Note that each parameter is an object that must contain at least a 'pass-as' property.
# The value can be anything and is not limited to the format above.
#
# You can define inputs (usually files containing datasets) which will be downloaded before the actual execution starts.
# Each input file will be placed in the special "input" directory and saved using the configured name.
#
# inputs:
# - name: mnist.npz
#   url: https://s3.amazonaws.com/img-datasets/mnist.npz
`;

export const ML_YAML_FILE = {
  name: 'ml.yaml',
  content: ML_YAML
};
