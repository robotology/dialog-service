# Copyright: (C) 2009 RobotCub Consortium
# Authors: Paul Fitzpatrick, Francesco Nori
# CopyPolicy: Released under the terms of the LGPLv2.1 or later, see LGPL.TXT

cmake_minimum_required(VERSION 3.0)

set(THREADS_PREFER_PTHREAD_FLAG ON)

find_package(YARP REQUIRED)
find_package(Threads REQUIRED)


#set(dir ${CMAKE_CURRENT_SOURCE_DIR})
#set(EXECUTABLE_OUTPUT_PATH ${dir} CACHE PATH "Build directory" FORCE)
#set(LIBRARY_OUTPUT_PATH ${dir} CACHE PATH "Build directory" FORCE)
#set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${dir})
#set(CMAKE_BUILD_FILES_DIRECTORY ${dir}/build)
#set(CMAKE_BUILD_DIRECTORY ${dir}/build)
#set(CMAKE_BINARY_DIR  ${dir}/bin)
#SET(EXECUTABLE_OUTPUT_PATH ${dir})
#SET(LIBRARY_OUTPUT_PATH ${dir}/build)
#SET(CMAKE_CACHEFILE_DIR ${dir})




#add_executable(r1_simulator r1_simulator.cpp)
#target_link_libraries(r1_simulator ${YARP_LIBRARIES})
include_directories(../include)
add_executable(R1Client R1Client.cpp)
target_link_libraries(R1Client ${YARP_LIBRARIES})
target_link_libraries(R1Client Threads::Threads)
