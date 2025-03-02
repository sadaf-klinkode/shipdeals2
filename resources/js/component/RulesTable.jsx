import { Badge, Button, ButtonGroup, DataTable } from '@shopify/polaris';
import { DeleteIcon, EditIcon } from '@shopify/polaris-icons';
import { useNavigate } from 'react-router-dom';
import { deleteRequest, updatePostRequestUsingId } from '../api';
import { formatDateTime } from '../hooks/formatDateTime';

const RulesTable = ({ discountRules, setLoading, setDiscountRules, loading, storeTimeZone }) => {
    const navigate = useNavigate();

    const discounts = discountRules?.map((rule) => {
        const startDateTime = formatDateTime(rule?.node?.discount?.startsAt, storeTimeZone);
        const endDateTime = formatDateTime(rule?.node?.discount?.endsAt, storeTimeZone);
        return {
            id: rule?.node?.id,
            type: rule?.node?.discount?.__typename === "DiscountCodeApp" ? "Code" : "Automatic",
            title: rule?.node?.discount?.title,
            status: rule?.node?.discount?.status,
            startsAt: startDateTime?.date,
            startsAtTime: startDateTime?.time,
            endsAt: endDateTime?.date,
            endsAtTime: endDateTime?.time,
            extensionType: rule?.node?.discount?.appDiscountType?.title
        }
    });

    const data = discounts?.map((discount) => [
        discount?.title,
        discount?.type,
        discount?.startsAt + ` (${discount?.startsAtTime})`,
        discount?.endsAt ? discount?.endsAt + ` (${discount?.endsAtTime})` : null,
        discount?.status == "ACTIVE" ?
            <Badge tone="success">
                {discount?.status}
            </Badge>
            :
            <Badge tone="critical">
                {discount?.status}
            </Badge >,
        <ButtonGroup>
            <Button plain icon={EditIcon} disabled={loading} onClick={() => editRule({ gid: discount?.id, type: discount?.type, extensionType: discount?.extensionType })} />
            <Button plain icon={DeleteIcon} disabled={loading} onClick={() => deleteRule({ gid: discount?.id, type: discount?.type })} />
        </ButtonGroup>,
    ])

    const editRule = async (discount) => {
        const id = discount?.gid.split('/').pop();
        const type = discount?.extensionType == 'shipping-discount' ? 'discount' : discount?.extensionType;
        if (discount?.type === "Code") {
            navigate(`/edit-rule/code/${id}/${type}`);
        } else {
            navigate(`/edit-rule/automatic/${id}/${type}`);
        }

    };
    const deleteRule = async (discount) => {
        const id = discount?.gid.split('/').pop();
        try {
            setLoading(true);
            if (discount?.type === "Code") {
                const data = await deleteRequest(`/api/delete-rule/code/${id}`);
                console.log(data); // Handle the response data as needed
                if (data?.deletedId?.data?.discountCodeDelete?.deletedCodeDiscountId) {
                    setDiscountRules((previousData) => previousData.filter((item) => item?.node.id !== discount?.gid));
                }
            } else {
                const data = await deleteRequest(`/api/delete-rule/automatic/${id}`);
                console.log(data);
                if (data?.deletedId?.data?.discountAutomaticDelete?.deletedAutomaticDiscountId) {
                    setDiscountRules((previousData) => previousData.filter((item) => item?.node.id !== discount?.gid));
                }
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DataTable
            columnContentTypes={[
                'text',
                'text',
                'text',
                'text',
                'text',
            ]}
            headings={[
                'Rule name',
                'Type',
                'Starts at (Time)',
                'Ends at (Time)',
                'Status',
                'Actions',
            ]}
            rows={data}
            footerContent={`Showing ${data.length} of ${data.length} results`}
        />
    );
};
export default RulesTable