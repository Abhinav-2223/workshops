# NTUHPC Workshop: Accelerating ML Workflows with Aspire2A

Training Machine learning (ML) models require substantial computational power, especially when dealing with large datasets and complex architectures. High-performance computing (HPC) systems like the [NSCC's Aspire2A Supercomputer](https://www.nscc.sg/aspire-2a/) provide the necessary resources to accelerate ML workflows, reducing training times.

In this workshop we will explore the use of the Aspire2A's GPUs to accelerate fine tuning of YOLOv11 to classify images in the [Rock-Paper-Scissors Dataset](https://universe.roboflow.com/roboflow-58fyf/rock-paper-scissors-sxsw/dataset/14).

# Access Aspire2A

## Setup NSCC User Account

To access Aspire2A, follow these steps to set up your NSCC user account:

1. Ensure you are NTU network: connected on `NTUSecure` or via [VPN](https://vpngate-student.ntu.edu.sg/global-protect/getsoftwarepage.esp)
2. Going to [NSCC Users Page](https://user.nscc.sg/saml/) to register for Aspire2A access.
3. Set a password for your user account by [Following the NSCC Entrollment guide](https://help.nscc.sg/wp-content/uploads/2024/05/NSCC-UserEnrollmentGuide-v0.1.pdf)

   > Optional: Download a SSH key for passwordless access. Learning how the SSH key for passwordless access is left as an exercise for the reader.

## Connecting to Aspire2A via SSH

Accessing the Aspire2A supercomputer requires using SSH: PUTTY on Windows & `ssh` command on Mac / Linux.

### Windows (Using PuTTY)

Connect to Aspire2A using PuTTY:

1. **Install PuTTY**

   - Download and install [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html).

2. **Configure PuTTY**

   - Open _PuTTY_ and enter:
     - **Host Name**: `<USERNAME>@aspire2a.nscc.sg`
       - Replace `USERNAME` with your Aspire2A username.
     - **Port**: `22`
     - **Connection Type**: `SSH`

3. **Connect**
   - Click _Open_ and enter your password when prompted.
   - If prompted to `continue connecting (yes / no)?` , type `yes` and press _Enter_.

Have a look at this [PuTTY guide > Simple Password-Based Login](https://www.lrz.de/services/compute/courses/x_lecturenotes/191007_PuTTY_Tutorial_2019.pdf) for screenshots and more guidance.

### Mac & Linux (Using Terminal)

Connect to Aspire2A via `ssh`

1. **Open Terminal**
2. **Run SSH Command**

   ```bash
   ssh <USERNAME>@aspire2a.nscc.sg
   ```

   - Replace `<USERNAME>` with your Aspire2A username.

3. **Accept the Host Key (First-Time Login)**

   - If prompted to `continue connecting (yes / no)?` , type `yes` and press _Enter_.

4. **Enter Password**
   - Enter your password when prompted.
