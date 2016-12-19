namespace ElectronicSchem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddVirtualProperty3 : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.InputModels", name: "ComponentModel_ID", newName: "Component_ID");
            RenameColumn(table: "dbo.PropertyModels", name: "ComponentModel_ID", newName: "Component_ID");
            RenameColumn(table: "dbo.PropertyItemsModels", name: "PropertyModel_ID", newName: "Property_ID");
            RenameIndex(table: "dbo.InputModels", name: "IX_ComponentModel_ID", newName: "IX_Component_ID");
            RenameIndex(table: "dbo.PropertyModels", name: "IX_ComponentModel_ID", newName: "IX_Component_ID");
            RenameIndex(table: "dbo.PropertyItemsModels", name: "IX_PropertyModel_ID", newName: "IX_Property_ID");
        }
        
        public override void Down()
        {
            RenameIndex(table: "dbo.PropertyItemsModels", name: "IX_Property_ID", newName: "IX_PropertyModel_ID");
            RenameIndex(table: "dbo.PropertyModels", name: "IX_Component_ID", newName: "IX_ComponentModel_ID");
            RenameIndex(table: "dbo.InputModels", name: "IX_Component_ID", newName: "IX_ComponentModel_ID");
            RenameColumn(table: "dbo.PropertyItemsModels", name: "Property_ID", newName: "PropertyModel_ID");
            RenameColumn(table: "dbo.PropertyModels", name: "Component_ID", newName: "ComponentModel_ID");
            RenameColumn(table: "dbo.InputModels", name: "Component_ID", newName: "ComponentModel_ID");
        }
    }
}
