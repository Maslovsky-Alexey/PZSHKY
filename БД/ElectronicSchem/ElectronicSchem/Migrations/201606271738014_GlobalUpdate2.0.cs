namespace ElectronicSchem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class GlobalUpdate20 : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.CommentModels", name: "PostModel_ID", newName: "Post_ID");
            RenameIndex(table: "dbo.CommentModels", name: "IX_PostModel_ID", newName: "IX_Post_ID");
        }
        
        public override void Down()
        {
            RenameIndex(table: "dbo.CommentModels", name: "IX_Post_ID", newName: "IX_PostModel_ID");
            RenameColumn(table: "dbo.CommentModels", name: "Post_ID", newName: "PostModel_ID");
        }
    }
}
