import { Box, Button, Container, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { getWeatherByLocation } from "../redux/actions";
import { HiLocationMarker, HiRefresh } from "react-icons/hi";

export const Error = () => {
    const dispatch = useDispatch();

    const handleRetryLocation = () => {
        // Clear any cached weather data
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.removeItem("weather");
            console.log("Cleared cached weather data");
        }
        dispatch(getWeatherByLocation());
    };

    const handleClearCache = () => {
        // Clear all cached data and reload
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.clear();
            console.log("Cleared all session storage");
        }
        window.location.reload();
    };

    return (
        <Container mt={['200px', '100px']} p={'100px'} maxW="container.md">
            <VStack spacing={6} textAlign="center">
                <Heading color="red.500" size="lg">
                    Weather Data Unavailable
                </Heading>
                <Text color="gray.600" fontSize="lg">
                    We couldn't load the weather information. This could be due to:
                </Text>
                <Box textAlign="left" color="gray.600">
                    <Text>• Location access denied by your browser</Text>
                    <Text>• Network connection issues</Text>
                    <Text>• Weather service temporarily unavailable</Text>
                    <Text>• Invalid city name (if searching)</Text>
                    <Text>• Cached data corruption</Text>
                </Box>
                <Flex gap={4} flexWrap="wrap" justify="center">
                    <Button
                        leftIcon={<HiLocationMarker />}
                        colorScheme="blue"
                        onClick={handleRetryLocation}
                        size="lg"
                    >
                        Try My Location
                    </Button>
                    <Button
                        leftIcon={<HiRefresh />}
                        colorScheme="orange"
                        onClick={handleClearCache}
                        size="lg"
                    >
                        Clear Cache & Reload
                    </Button>
                </Flex>
                <Text color="gray.500" fontSize="sm">
                    Check your browser's location permissions and try again
                </Text>
            </VStack>
        </Container>
    );
};