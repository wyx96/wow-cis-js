import { Form } from 'ant-design-vue';
const useForm = Form.useForm;

/**
 * @description form 页面操作方法封装
 * @param {object} formProps 表单参数（antd）
 * @param {Function} formComponents 表单json
 * @param {string} type 类型 search row table
 * */
export const useWowForm = ({ formProps = {}, formComponents, type = 'search' }) => {
	const getFormDataJson = (data, type, formData) => {
		let formDataJson = formData || {};
		let rules = {};
		for (let i = 0; i < data.length; i++) {
			const row = data[i];
			let defaultVal = '';

			if (type == 'search') {
				let key = row['name'];
				if (key) {
					formDataJson[key] = row['defaultValue'] || defaultVal;
					rules[key] = row['rule'] || [{ required: false, message: '' }];
					if (row.children && row.children.length) {
						getFormDataJson(row.children, 'search', formDataJson);
					}
				}
			} else if (type == 'row') {
				const cols = data[i].cols;
				console.log(cols, 1);
				for (let j = 0; j < cols.length; j++) {
					const ele = cols[j];
					let key = ele['name'];
					if (key) {
						formDataJson[key] = ele['defaultValue'] || defaultVal;
						rules[key] = ele['rule'] || [{ required: false, message: '' }];
					}
				}
			} else {
				const cols = data[i].cols;
				for (let j = 0; j < cols.length; j++) {
					const ele = cols[j].element;
					for (let k = 0; k < ele.length; k++) {
						const item = ele[k];
						let key = item['name'];
						if (key) {
							if (item.type === 'checkbox') {
								defaultVal = [];
							}
							formDataJson[key] = item['defaultValue'] || defaultVal;
							rules[key] = item['rule'] || [{ required: false, message: '' }];
						}
					}
				}
			}
		}
		console.log('formDataJson:', formDataJson);
		return { formDataJson, rules };
	};
	const { formDataJson, rules } = getFormDataJson(formComponents({}), type);
	const formRef = ref();
	const modelRef = reactive(formDataJson);
	// modelRef.taskInfo = '';
	// {
	// 	name: [
	// 		{
	// 			required: true,
	// 			message: 'Please input name'
	// 		}
	// 	]
	// }

	const searchForm = useForm(modelRef, reactive(rules));
	const { resetFields, validate, validateInfos } = searchForm;
	const submitFields = callback => {
		validate()
			.then(() => {
				console.log(toRaw(modelRef));
				callback && callback();
			})
			.catch(err => {
				console.log('error', err);
			});
	};
	const customFormProps = {
		formProps: {
			ref: formRef,
			// class: 'formTableStyle',
			// labelCol: { span: 4 },
			// wrapperCol: { span: 14 },
			// rules: {},
			renderType: type, // search 搜索  table 表格 row栅格
			...formProps
		},
		formData: modelRef,
		formComponents: formComponents({ formData: modelRef }),
		validateInfos: validateInfos
	};

	return {
		// ...toRefs(state),
		customFormProps,
		searchForm,
		modelRef,
		resetFields,
		submitFields
	};
};
