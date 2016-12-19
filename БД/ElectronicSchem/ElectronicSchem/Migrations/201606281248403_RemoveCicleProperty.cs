namespace ElectronicSchem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemoveCicleProperty : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.ComponentModels", name: "Post_ID", newName: "PostModel_ID");
            RenameColumn(table: "dbo.WireModels", name: "Post_ID", newName: "PostModel_ID");
            RenameIndex(table: "dbo.ComponentModels", name: "IX_Post_ID", newName: "IX_PostModel_ID");
            RenameIndex(table: "dbo.WireModels", name: "IX_Post_ID", newName: "IX_PostModel_ID");
        }
        
        public override void Down()
        {
            RenameIndex(table: "dbo.WireModels", name: "IX_PostModel_ID", newName: "IX_Post_ID");
            RenameIndex(table: "dbo.ComponentModels", name: "IX_PostModel_ID", newName: "IX_Post_ID");
            RenameColumn(table: "dbo.WireModels", name: "PostModel_ID", newName: "Post_ID");
            RenameColumn(table: "dbo.ComponentModels", name: "PostModel_ID", newName: "Post_ID");
        }
    }
}
