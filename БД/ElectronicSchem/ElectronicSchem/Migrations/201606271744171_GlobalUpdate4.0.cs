namespace ElectronicSchem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class GlobalUpdate40 : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.WireModels", name: "PostModel_ID", newName: "Post_ID");
            RenameIndex(table: "dbo.WireModels", name: "IX_PostModel_ID", newName: "IX_Post_ID");
        }
        
        public override void Down()
        {
            RenameIndex(table: "dbo.WireModels", name: "IX_Post_ID", newName: "IX_PostModel_ID");
            RenameColumn(table: "dbo.WireModels", name: "Post_ID", newName: "PostModel_ID");
        }
    }
}
