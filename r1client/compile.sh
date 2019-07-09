rm -rf build
mkdir build
cmake -B./build -H./src
make -C ./build
