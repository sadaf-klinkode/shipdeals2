import { Button, Card, Layout, MediaCard, Page, Text, VideoThumbnail } from "@shopify/polaris";
import AppLayout from "../component/AppLayout";
import { useNavigate } from "react-router-dom";
import { videos } from "../data";

const Tutorials = () => {
    const navigate = useNavigate();

    return (
        <AppLayout>
            <Page
                title="Video tutorials"
                backAction={{
                    content: 'Back',
                    onAction: () => navigate(-1),
                }}
            >
                <Layout>
                    {
                        videos.map((video, index) => (
                            <Layout.Section variant="oneThird" key={index}>
                                <Card sectioned>
                                    <iframe width="100%" height="250" src={video.url} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                                    <Text as="p" variant="headingXs">
                                        {video.title}
                                    </Text>
                                    <Button primary onClick={()=> {
                                        window.open(video.url, "_blank");
                                    }}>View FullScreen</Button>
                                </Card>
                            </Layout.Section>
                        ))
                    }
                </Layout>
            </Page>
        </AppLayout>
    );
};
export default Tutorials