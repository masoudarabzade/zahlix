<?php
// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get mode parameter
$mode = isset($_GET['mode']) ? $_GET['mode'] : 'integer';

// Define directories for each mode
$directories = [
    'integer' => 'file/number/integer',
    'decimal' => 'file/number/decimal',
    'date' => 'file/date/dates',
    'dateRange' => 'file/date/date-ranges',
    'time' => 'file/time/times',
    'timeRange' => 'file/time/time-ranges',
    'price' => 'file/preis',
    'year' => 'file/jahres'
];

// Function to get audio files from directory
function getAudioFiles($directory, $mode) {
    $files = [];
    
    // Check if directory exists
    if (!is_dir($directory)) {
        // Try to create directory if it doesn't exist
        if (!mkdir($directory, 0755, true)) {
            return ['error' => "Directory not found and cannot be created: $directory", 'files' => []];
        }
    }
    
    // Scan directory
    $scanResult = scandir($directory);
    
    if ($scanResult === false) {
        return ['error' => 'Cannot read directory', 'files' => []];
    }
    
    foreach ($scanResult as $file) {
        // Skip . and .. and hidden files
        if ($file[0] === '.') {
            continue;
        }
        
        // Check if it's an MP3 file
        $pathInfo = pathinfo($file);
        if (isset($pathInfo['extension']) && 
            strtolower($pathInfo['extension']) === 'mp3') {
            
            // Extract number from filename based on mode
            $number = extractNumberFromFilename($pathInfo['filename'], $mode);
            
            $files[] = [
                'number' => $number,
                'filename' => $file,
                'path' => str_replace(dirname(__DIR__) . '/', '', $directory) . '/' . $file,
                'size' => filesize($directory . '/' . $file),
                'modified' => filemtime($directory . '/' . $file),
                'mode' => $mode
            ];
        }
    }
    
    // Sort by number
    usort($files, function($a, $b) {
        return $a['number'] - $b['number'];
    });
    
    return ['success' => true, 'files' => $files, 'count' => count($files)];
}

// Extract number from filename based on mode
function extractNumberFromFilename($filename, $mode) {
    switch ($mode) {
        case 'integer':
            // Extract numeric part from filename
            preg_match('/\d+/', $filename, $matches);
            return isset($matches[0]) ? (int)$matches[0] : 0;
            
        case 'decimal':
            // Extract number before 'komma'
            if (strpos($filename, 'komma') !== false) {
                $parts = explode('komma', $filename);
                return (int)$parts[0];
            }
            preg_match('/\d+/', $filename, $matches);
            return isset($matches[0]) ? (int)$matches[0] : 0;
            
        case 'date':
            // Extract day number
            preg_match('/^\d+/', $filename, $matches);
            return isset($matches[0]) ? (int)$matches[0] : 0;
            
        case 'dateRange':
            // Extract first day number
            preg_match('/^\d+/', $filename, $matches);
            return isset($matches[0]) ? (int)$matches[0] : 0;
            
        case 'time':
            // Extract hour
            preg_match('/^\d+/', $filename, $matches);
            return isset($matches[0]) ? (int)$matches[0] : 0;
            
        case 'timeRange':
            // Extract first hour
            preg_match('/^\d+/', $filename, $matches);
            return isset($matches[0]) ? (int)$matches[0] : 0;
            
        case 'price':
            // Extract integer part before underscore
            if (strpos($filename, '_') !== false) {
                $parts = explode('_', $filename);
                return (int)$parts[0];
            }
            preg_match('/\d+/', $filename, $matches);
            return isset($matches[0]) ? (int)$matches[0] : 0;
            
        case 'year':
            // Year is the filename
            return (int)$filename;
            
        default:
            return 0;
    }
}

// Main execution
try {
    // Get base directory
    $baseDir = dirname(__DIR__);
    
    // Get directory path for the requested mode
    if (!isset($directories[$mode])) {
        throw new Exception("Invalid mode: $mode");
    }
    
    $relativeDir = $directories[$mode];
    $directory = $baseDir . '/' . $relativeDir;
    
    // Get files
    $result = getAudioFiles($directory, $mode);
    
    // Add server info
    $result['server_info'] = [
        'mode' => $mode,
        'directory' => $relativeDir,
        'absolute_directory' => $directory,
        'exists' => is_dir($directory),
        'readable' => is_readable($directory),
        'scanned_at' => date('Y-m-d H:i:s')
    ];
    
    echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error: ' . $e->getMessage(),
        'files' => []
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
?>