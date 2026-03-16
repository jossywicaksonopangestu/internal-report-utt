import {Button, Form, Input, Upload, Modal} from 'antd';
import {FormInstance} from 'antd/es/form';
import {PlusOutlined, MinusCircleOutlined} from '@ant-design/icons';
import {Inbox} from 'lucide-react';
import {EditReportFormValues} from '../types';

const {Dragger} = Upload;

interface EditReportFormProps {
  form: FormInstance<EditReportFormValues>;
  isSubmitting: boolean;
  onFinish: (values: EditReportFormValues) => void;
}

export function EditReportForm({
  form,
  isSubmitting,
  onFinish,
}: EditReportFormProps) {
  const [modal, modalContextHolder] = Modal.useModal();

  const uploadProps = {
    beforeUpload: () => false,
    maxCount: 1,
    className: 'custom-dragger',
  };

  const handleConfirmSubmit = (values: EditReportFormValues) => {
    modal.confirm({
      title: 'Resubmit Report?',
      content:
        'Are you sure you have fixed the issues based on the Admin notes? This will send the report back for approval.',
      okText: 'Yes, Resubmit',
      cancelText: 'Check Again',
      centered: true,
      onOk: () => {
        onFinish(values);
      },
    });
  };

  return (
    <div className="w-full bg-[#A4A9FF] rounded-4xl p-4 sm:p-6 md:p-10 shadow-xl relative overflow-hidden">
      {modalContextHolder}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleConfirmSubmit}
        requiredMark={false}
      >
        <Form.Item
          name="supervisorName"
          label={
            <span className="font-bold text-white text-lg">
              Supervisor Name
            </span>
          }
          rules={[{required: true, message: 'Please input supervisor name!'}]}
          className="mb-8 max-w-md"
        >
          <Input
            size="large"
            placeholder="E.g., Budi Santoso"
            className="rounded-xl! h-12!"
          />
        </Form.Item>

        <div className="border-t border-white/20 pt-8 mb-4">
          <h3 className="text-2xl font-bold text-white mb-2">
            Execution & Evidence (Fix Mode)
          </h3>
          <p className="text-white/80 mb-6">
            Review your previous inputs and upload new photos if requested by
            the Admin.
          </p>
        </div>

        <Form.List name="evidences">
          {(fields, {add, remove}) => (
            <div className="space-y-8">
              {fields.map(({key, name, ...restField}, index) => (
                <div
                  key={key}
                  className="relative bg-[#6168FF] rounded-3xl p-6 md:p-8 shadow-lg"
                >
                  <div className="flex justify-between items-center mb-6 border-b border-white/20 pb-4">
                    <h4 className="font-bold text-xl text-white">
                      Action Item #{index + 1}
                    </h4>
                    {fields.length > 1 && (
                      <Button
                        type="text"
                        danger
                        className="text-white hover:bg-red-500/20! hover:text-red-200!"
                        onClick={() => remove(name)}
                        icon={<MinusCircleOutlined />}
                      >
                        Remove Item
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div className="flex flex-col gap-4">
                      <Form.Item
                        {...restField}
                        name={[name, 'actionTitle']}
                        label={
                          <span className="font-bold text-white text-lg">
                            Action
                          </span>
                        }
                        rules={[
                          {required: true, message: 'Action is required'},
                        ]}
                      >
                        <Input.TextArea
                          rows={2}
                          placeholder="e.g. Check for unsafe actions..."
                          className="rounded-xl!"
                        />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'actionFileList']}
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                          Array.isArray(e) ? e : e?.fileList
                        }
                        rules={[
                          {required: true, message: 'Action photo is required'},
                        ]}
                        className="upload-wrapper"
                      >
                        <Dragger {...uploadProps}>
                          <p className="ant-upload-drag-icon flex justify-center text-white/80">
                            <Inbox size={40} />
                          </p>
                          <p className="text-white font-medium text-sm px-4">
                            Drag and drop file here, or select file. Existing
                            photo will be replaced if you upload a new one.
                          </p>
                        </Dragger>
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'actionDesc']}
                        label={
                          <span className="font-semibold text-white">
                            Photo Description{' '}
                            <span className="text-red-400">*</span>
                          </span>
                        }
                        rules={[
                          {required: true, message: 'Description is required'},
                        ]}
                      >
                        <Input.TextArea
                          rows={3}
                          placeholder="Describe the action taken..."
                          className="rounded-xl!"
                        />
                      </Form.Item>
                    </div>

                    <div className="flex flex-col gap-4">
                      <Form.Item
                        {...restField}
                        name={[name, 'outcomeTitle']}
                        label={
                          <span className="font-bold text-white text-lg">
                            Expected Outcome
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: 'Expected outcome is required',
                          },
                        ]}
                      >
                        <Input.TextArea
                          rows={2}
                          placeholder="e.g. No unsafe conditions identified..."
                          className="rounded-xl!"
                        />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'outcomeFileList']}
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                          Array.isArray(e) ? e : e?.fileList
                        }
                        rules={[
                          {
                            required: true,
                            message: 'Outcome photo is required',
                          },
                        ]}
                        className="upload-wrapper"
                      >
                        <Dragger {...uploadProps}>
                          <p className="ant-upload-drag-icon flex justify-center text-white/80">
                            <Inbox size={40} />
                          </p>
                          <p className="text-white font-medium text-sm px-4">
                            Drag and drop file here, or select file. Existing
                            photo will be replaced if you upload a new one.
                          </p>
                        </Dragger>
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'outcomeDesc']}
                        label={
                          <span className="font-semibold text-white">
                            Photo Description{' '}
                            <span className="text-red-400">*</span>
                          </span>
                        }
                        rules={[
                          {required: true, message: 'Description is required'},
                        ]}
                      >
                        <Input.TextArea
                          rows={3}
                          placeholder="Describe the outcome..."
                          className="rounded-xl!"
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-center mt-6">
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  className="h-12! px-8! rounded-xl! border-2! border-dashed! border-white/50! hover:border-white! bg-white/10! hover:bg-white/20! font-bold text-white shadow-sm"
                >
                  Add Another Item
                </Button>
              </div>
            </div>
          )}
        </Form.List>

        <div className="mt-12 flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            className="bg-[#cf1322]! hover:bg-[#a8071a]! h-12! px-12 rounded-xl! font-bold text-lg shadow-xl border-none"
          >
            Resubmit Fixes
          </Button>
        </div>
      </Form>
    </div>
  );
}
