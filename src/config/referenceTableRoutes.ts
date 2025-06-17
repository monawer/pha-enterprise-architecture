
export const referenceTableRoutes = [
  { path: 'departments', tableName: 'ref_departments', displayName: 'الإدارات والأقسام', description: 'قائمة بجميع الإدارات والأقسام في المؤسسة', columns: ['code', 'name', 'description', 'parent_code'] },
  { path: 'app-types', tableName: 'ref_app_types', displayName: 'أنواع التطبيقات', description: 'تصنيفات التطبيقات المختلفة', columns: ['code', 'name', 'description'] },
  { path: 'app-status', tableName: 'ref_app_status', displayName: 'حالات التطبيقات', description: 'الحالات المختلفة للتطبيقات', columns: ['code', 'name', 'description'] },
  { path: 'technologies', tableName: 'ref_technologies', displayName: 'التقنيات', description: 'قائمة التقنيات والأدوات المستخدمة', columns: ['code', 'name', 'description', 'category'] },
  { path: 'service-types', tableName: 'ref_service_types', displayName: 'أنواع الخدمات', description: 'تصنيفات الخدمات المقدمة', columns: ['code', 'name', 'description'] },
  { path: 'channel-types', tableName: 'ref_channel_types', displayName: 'أنواع القنوات', description: 'قنوات تقديم الخدمات المختلفة', columns: ['code', 'name', 'description'] },
  { path: 'data-classifications', tableName: 'ref_data_classifications', displayName: 'تصنيفات البيانات', description: 'مستويات تصنيف البيانات الأمنية', columns: ['code', 'name', 'description', 'level'] },
  { path: 'connection-types', tableName: 'ref_connection_types', displayName: 'أنواع الاتصالات', description: 'أنواع الاتصالات والتكامل', columns: ['code', 'name', 'description'] },
  { path: 'data-formats', tableName: 'ref_data_formats', displayName: 'صيغ البيانات', description: 'صيغ وأنواع البيانات المختلفة', columns: ['code', 'name', 'description'] },
  { path: 'integration-platforms', tableName: 'ref_integration_platforms', displayName: 'منصات التكامل', description: 'المنصات المستخدمة في التكامل', columns: ['code', 'name', 'description'] },
  { path: 'policy-types', tableName: 'ref_policy_types', displayName: 'أنواع السياسات', description: 'تصنيفات السياسات', columns: ['code', 'name', 'description'] },
  { path: 'procedure-types', tableName: 'ref_procedure_types', displayName: 'أنواع الإجراءات', description: 'تصنيفات الإجراءات', columns: ['code', 'name', 'description'] },
  { path: 'automation-levels', tableName: 'ref_automation_levels', displayName: 'مستويات الأتمتة', description: 'مستويات الأتمتة', columns: ['code', 'name'] },
  { path: 'operation-types', tableName: 'ref_operation_types', displayName: 'أنواع العمليات', description: 'تصنيفات العمليات', columns: ['code', 'name', 'description'] },
  { path: 'manufacturers', tableName: 'ref_manufacturers', displayName: 'الشركات المصنعة', description: 'بيانات الشركات المصنعة', columns: ['code', 'name', 'country', 'website'] },
  { path: 'security-functions', tableName: 'ref_security_functions', displayName: 'وظائف الأمان', description: 'وظائف الأمان المختلفة', columns: ['code', 'name', 'description', 'category'] }
];
