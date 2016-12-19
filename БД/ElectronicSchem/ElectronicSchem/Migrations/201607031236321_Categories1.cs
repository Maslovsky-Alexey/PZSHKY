namespace ElectronicSchem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Categories1 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.PostModels", "Category_ID", "dbo.CategoryModels");
            DropIndex("dbo.PostModels", new[] { "Category_ID" });
            AddColumn("dbo.PostModels", "CategoryId", c => c.Long(nullable: false));
            DropColumn("dbo.PostModels", "Category_ID");
        }
        
        public override void Down()
        {
            AddColumn("dbo.PostModels", "Category_ID", c => c.Long());
            DropColumn("dbo.PostModels", "CategoryId");
            CreateIndex("dbo.PostModels", "Category_ID");
            AddForeignKey("dbo.PostModels", "Category_ID", "dbo.CategoryModels", "ID");
        }
    }
}
