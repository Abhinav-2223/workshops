#!/bin/bash
### PBS Directives

### Specify name for job
#PBS -N jupyterlab

### Submit to normal queue
#PBS -q normal

### Request for compute resources
#PBS -l select=1:ncpus=2:ngpus=1:mem=32gb

### Request for 2hr of runtime
#PBS -l walltime=2:00:00

### Bill to personal project
#PBS -P personal

### PBS Job Standard output by default goes to file $PBS_JOBNAME.o$PBS_JOBID
### To merge standard output and error use the following
#PBS -j oe

### Start of commands to be run on compute node
# Change directory to the working directory where job was submitted
cd $PBS_O_WORKDIR || exit $?

{
# Generate a random port number for jupyterlab from 8000-8999 to listen on to avoid clashes with other users
PORT=$(shuf -i8000-8999 -n1)

# Start Pytouch container running JupyterLab
echo "JupyterLab will listen on: `hostname`:$PORT"
# --nv Provides access to GPUs
/app/apps/singularity/3.10.0/bin/singularity exec --nv  \
  /app/apps/containers/pytorch/pytorch-nvidia-22.04-py3.sif \
  jupyter-lab --no-browser --ip=0.0.0.0 --port=$PORT

# redirect command block stderr & output to separate log file
# we cant use the default PBS job log file as it only delivered when the job exits, 
# and we need jupyterlab's output to access jupyterlab running in the container.
}  >> ${PBS_JOBNAME}.${PBS_JOBID}.log 2>&1
