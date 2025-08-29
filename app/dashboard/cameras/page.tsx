'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/providers/AuthProvider';
import DashboardLayout from '../../../components/layout/DashboardLayout';

interface CameraData {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  lastFrame: string;
  resolution: string;
  recording: boolean;
}

export default function Cameras() {
  const { user, selectedStore } = useAuth();
  const [cameras, setCameras] = useState<CameraData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [recordingAll, setRecordingAll] = useState(false);

  useEffect(() => {
    // Mock camera data
    const mockCameras: CameraData[] = [
      {
        id: 'cam-001',
        name: 'Entrance Door',
        location: 'Main Entrance',
        status: 'online',
        lastFrame: new Date().toISOString(),
        resolution: '1920x1080',
        recording: true
      },
      {
        id: 'cam-002',
        name: 'Checkout Area',
        location: 'Checkout Counter',
        status: 'online',
        lastFrame: new Date().toISOString(),
        resolution: '1920x1080',
        recording: true
      },
      {
        id: 'cam-003',
        name: 'Product Shelves',
        location: 'Aisle 1-3',
        status: 'online',
        lastFrame: new Date().toISOString(),
        resolution: '1280x720',
        recording: false
      },
      {
        id: 'cam-004',
        name: 'Storage Room',
        location: 'Back Office',
        status: 'maintenance',
        lastFrame: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        resolution: '1280x720',
        recording: false
      }
    ];

    setCameras(mockCameras);
    setLoading(false);
  }, []);

  const toggleRecording = (cameraId: string) => {
    setCameras(prev => prev.map(cam => 
      cam.id === cameraId 
        ? { ...cam, recording: !cam.recording }
        : cam
    ));
  };

  const toggleAllRecording = () => {
    const newRecordingState = !recordingAll;
    setRecordingAll(newRecordingState);
    setCameras(prev => prev.map(cam => 
      cam.status === 'online' 
        ? { ...cam, recording: newRecordingState }
        : cam
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatLastFrame = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Camera Management</h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage security cameras for {selectedStore?.name}
            </p>
          </div>
          <button
            onClick={toggleAllRecording}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              recordingAll 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {recordingAll ? 'Stop All Recording' : 'Start All Recording'}
          </button>
        </div>

        {/* Camera Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Cameras</h3>
            <p className="text-2xl font-bold text-gray-900">{cameras.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Online</h3>
            <p className="text-2xl font-bold text-green-600">
              {cameras.filter(cam => cam.status === 'online').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Recording</h3>
            <p className="text-2xl font-bold text-blue-600">
              {cameras.filter(cam => cam.recording).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Offline/Maintenance</h3>
            <p className="text-2xl font-bold text-red-600">
              {cameras.filter(cam => cam.status !== 'online').length}
            </p>
          </div>
        </div>

        {/* Camera Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cameras.map((camera) => (
            <div key={camera.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Camera Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{camera.name}</h3>
                    <p className="text-sm text-gray-600">{camera.location}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(camera.status)}`}>
                      {camera.status}
                    </span>
                    {camera.recording && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 animate-pulse">
                        REC
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Camera Feed Placeholder */}
              <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
                {camera.status === 'online' ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm">Live Feed</p>
                    <p className="text-gray-500 text-xs">{camera.resolution}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm">Camera Offline</p>
                  </div>
                )}
                
                {/* Timestamp Overlay */}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {formatLastFrame(camera.lastFrame)}
                </div>
              </div>

              {/* Camera Controls */}
              <div className="p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Last frame: {formatLastFrame(camera.lastFrame)}
                  </div>
                  <div className="flex space-x-2">
                    {camera.status === 'online' && (
                      <button
                        onClick={() => toggleRecording(camera.id)}
                        className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors ${
                          camera.recording
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {camera.recording ? 'Stop Recording' : 'Start Recording'}
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedCamera(selectedCamera === camera.id ? null : camera.id)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {selectedCamera === camera.id ? 'Close' : 'View Full'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Camera Details Modal */}
        {selectedCamera && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {cameras.find(cam => cam.id === selectedCamera)?.name}
                  </h2>
                  <button
                    onClick={() => setSelectedCamera(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xl">Full Screen Live Feed</p>
                    <p className="text-gray-400">High Quality Stream</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className="ml-2 text-gray-600">
                      {cameras.find(cam => cam.id === selectedCamera)?.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Resolution:</span>
                    <span className="ml-2 text-gray-600">
                      {cameras.find(cam => cam.id === selectedCamera)?.resolution}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="ml-2 text-gray-600">
                      {cameras.find(cam => cam.id === selectedCamera)?.location}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Recording:</span>
                    <span className="ml-2 text-gray-600">
                      {cameras.find(cam => cam.id === selectedCamera)?.recording ? 'Active' : 'Stopped'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
