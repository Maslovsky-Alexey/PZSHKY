namespace ElectronicSchem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class GlobalUpdate30 : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.ComponentModels", name: "PostModel_ID", newName: "Post_ID");
            RenameIndex(table: "dbo.ComponentModels", name: "IX_PostModel_ID", newName: "IX_Post_ID");
        }
        
        public override void Down()
        {
            RenameIndex(table: "dbo.ComponentModels", name: "IX_Post_ID", newName: "IX_PostModel_ID");
            RenameColumn(table: "dbo.ComponentModels", name: "Post_ID", newName: "PostModel_ID");
        }
    }
}
